import {memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {useSubscribe} from 'whip-sdk-react';
import './App.css';

const Subscriber = (props: { streamId: string, token: string, muteVideo: boolean, muteAudio: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const subscriber = useRef(useSubscribe(props.token)).current;
  const [ iceState, setIceState ] = useState("");
  const [ resolution, setResolution ] = useState("");
  const [ frameRate, setFrameRate ] = useState("");
  const [ codeRate, setCodeRate ] = useState("");
  const [ volume, setVolume ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");


  useEffect(() => {
    const stream = subscriber.subscribe();
    console.log('stream', stream);
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
    return () => {
      subscriber.unsubscribe()
    };
  }, [])

  useLayoutEffect(() => {
    if (videoRef.current?.srcObject) {
      subscriber.mute(props.muteVideo, 'video');
    }
  }, [props.muteVideo])

  useLayoutEffect(() => {if (videoRef.current?.srcObject) {
    subscriber.mute(props.muteAudio, 'audio');
  }
  }, [props.muteAudio])

  return (
    <>
      <video className="renderDom" autoPlay playsInline ref={videoRef} controls />
      <div className="Video-info">
        <p id="ICE">Conn State：{iceState}</p>
        <p id="Resolution">
          Resolution：
          {resolution === 'undefined*undefined'
            ? '读取中'
            : resolution}
        </p>
        <p id="FrameRate">
          Frame Rate：
          {frameRate === 'undefined'
            ? '读取中'
            : frameRate}
        </p>
        <p id="VideoBitrate">Video Bitrate：{codeRate}</p>
        <p id="Volume">Volume：{volume}</p>
        <p id="ErrorMessage" style={{color: 'red'}}>
          {errorMessage
            ? `错误信息：${errorMessage}`
            : ''}
        </p>
      </div>
    </>
  );
};

export default memo(Subscriber);
