import {memo} from 'react';

const VideoInfo = (props: {iceState: string, resolution: string, frameRate: string, codeRate: string, volume: string, errorMessage: string}) => {

  return <>
    <div className="Video-info">
      <p id="ICE">Conn State：{props.iceState}</p>
      <p id="Resolution">
        Resolution：
        {props.resolution === 'undefined*undefined'
          ? 'Reading..'
          : props.resolution}
      </p>
      <p id="FrameRate">
        Frame Rate：
        {props.frameRate === 'undefined'
          ? 'Reading..'
          : props.frameRate}
      </p>
      <p id="VideoBitrate">Video Bitrate：{props.codeRate}</p>
      <p id="Volume">Volume：{props.volume}</p>
      <p id="ErrorMessage" style={{color: 'red'}}>
        {props.errorMessage
          ? `Error message：${props.errorMessage}`
          : ''}
      </p>
    </div>
  </>
};
export default memo(VideoInfo);
