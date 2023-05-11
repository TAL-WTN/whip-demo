import {memo, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useSubscribe} from 'whip-sdk-react';
import './App.css';
import {Button, Input, Space} from '@arco-design/web-react';
import {IconRefresh, IconVideoCamera, IconVoice} from '@arco-design/web-react/icon';
import {v4 as uuid} from 'uuid';
import {generateToken} from './util';

const Subscriber = (props: { streamId: string, token: string }) => {
  const [videoStream, setVideoStream] = useState<MediaStream>();
  // const subscriber = useSubscribe(props.token);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [ iceState, setIceState ] = useState("");
  const [ resolution, setResolution ] = useState("");
  const [ frameRate, setFrameRate ] = useState("");
  const [ codeRate, setCodeRate ] = useState("");
  const [ volume, setVolume ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");


  return (
    <>
      <video className="renderDom" autoPlay playsInline ref={videoRef} muted></video>
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
