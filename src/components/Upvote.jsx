import PropTypes from 'prop-types';
import supabase from '../utils/supabase';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import 'animate.css';

const Upvote = ({ index, icon, text, subtext, noLikeUI=false }) => {

  Upvote.propTypes = {
    index: PropTypes.number,
    icon: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    subtext: PropTypes.string,
    noLikeUI: PropTypes.bool,
  };

  const [likeCount, setLikeCount] = useState(0);
  const [isButtonReady, setBtnReady] = useState(false);
  const [liked, setLiked] = useState(localStorage.getItem(`${index}`) === 'true' || false);
  const [animations, setAnimations] = useState("");

  const handleLike = async () => {
    // Start animation
    setAnimations("animate__animated animate__tada");
    setBtnReady(true);

    // Update like count
    const updatedLikes = liked ? likeCount - 1 : likeCount + 1;
    setLikeCount(updatedLikes);

    // Update liked state
    setLiked(!liked);

    // Update local storage
    localStorage.setItem(`${index}`, String(!liked));

    // Update like count in database
    await supabase
      .from('polubienia')
      .update({ id: index, likes: updatedLikes })
      .eq('id', index);

    // End animation after a short delay
    setTimeout(() => {
      setBtnReady(false);
      setAnimations("");
    }, 1000);
  };

  useEffect(() => {
    if (noLikeUI) return;
    const fetchData = async () => {
      let { data, error } = await supabase
        .from('polubienia')
        .select('likes')
        .eq('id', index)
        .single();
      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        setLikeCount(data.likes);
      }
    };

    fetchData();

    const subscription = supabase
      .channel(index)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'polubienia' },
        (payload) => {
          if (payload.new.id !== index) return;
          setLikeCount(payload.new.likes);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <button className="upvote-card" disabled={isButtonReady} onClick={handleLike}>
      <div className="upvote-card__content">
      <FontAwesomeIcon icon={icon} size="2xl" className='Icon'/>
        <p>{text}</p>
        <p>{subtext}</p>
        {!noLikeUI && 
          <span className='likeButton'>
          {liked ? (
            <FontAwesomeIcon size="lg" icon={faHeartSolid} className={animations} />
          ) : (
            <FontAwesomeIcon size="lg"icon={faHeart} className={animations} />
          )}
          <p>{likeCount}</p>
        </span>
        }
      </div>
    </button>
  );
};

export default Upvote;
