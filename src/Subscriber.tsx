import {memo, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useSubscribe} from 'whip-sdk-react';
import './App.css';
import VideoInfo from './VideoInfo';



const Subscriber = (props: { streamId: string, token: string, muteVideo: boolean, muteAudio: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [ stream, setStream ] = useState<MediaStream | undefined>();
  const [ pc, setPc ] = useState<RTCPeerConnection | undefined>();
  const [ errorMessage, setErrorMessage ] = useState("");
  // step 1: call useSubscribe hook to get subscribe function
  const subscriber = useRef(useSubscribe(props.token)).current;

  useEffect(() => {
    // step 2: call subscribe function to subscribe stream
    const stream = subscriber.subscribe();
    setStream(stream);
    setPc(subscriber.getPeerConnection());
    if (videoRef.current) {
      // step 3: set stream to video element to render remote stream
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }

    return () => {
      subscriber.unsubscribe()
    };
  }, [subscriber]);

  // mute video
  useLayoutEffect(() => {
    if (videoRef.current?.srcObject) {
      subscriber.mute(props.muteVideo, 'video');
    }
  }, [props.muteVideo])

  // mute audio
  useLayoutEffect(() => {
    if (videoRef.current?.srcObject) {
      subscriber.mute(props.muteAudio, 'audio');
    }
  }, [props.muteAudio])

  return (
    <>
      <video className="renderDom" autoPlay playsInline ref={videoRef} />
      <VideoInfo pc={pc} stream={stream} errorMessage={errorMessage} />
    </>
  );
};

export default memo(Subscriber);
