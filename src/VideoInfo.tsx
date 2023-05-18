import { memo, useState, useEffect, useCallback } from 'react';
import { getAudioStats, getVideoStats, sleep } from './util';

const VideoInfo = (props: {pc?: RTCPeerConnection, stream?: MediaStream, errorMessage: string}) => {

  const [ iceState, setIceState ] = useState("");
  const [ resolution, setResolution ] = useState("");
  const [ frameRate, setFrameRate ] = useState("");
  const [ codeRate, setCodeRate ] = useState("");
  const [ volume, setVolume ] = useState("");
  const [ videoTrack, setVideoTrack ] = useState<MediaStreamTrack | undefined>();
  const [ audioTrack, setAudioTrack ] = useState<MediaStreamTrack | undefined>();

  /**
   * Display the media statistics of the audio and video streams,
   * including resolution, frame rate, code rate, and volume status.
   */
  const startStatsLoop = useCallback(async (pc: RTCPeerConnection) => {
    if (videoTrack) {
      const stats = await getVideoStats(pc, videoTrack)
      setResolution(stats.resolution);
      setFrameRate(stats.fps);
      setCodeRate(stats.vbps.toString());
    }
  
    if (audioTrack) {
      const stats = await getAudioStats(pc, audioTrack)
      setVolume(stats.volume);
    }

    setIceState(pc.iceConnectionState);

    await sleep(1000);
    startStatsLoop(pc);
  }, [videoTrack, audioTrack]);

  const onTrackAdded = useCallback((pc: RTCPeerConnection) => {
    pc.addEventListener('track', (e: RTCTrackEvent) => {
      if (e.track.kind === 'video') {
        setVideoTrack(e.track);
        return;
      }
      if (e.track.kind === 'audio') {
        setAudioTrack(e.track);
        return;
      }
    });
  }, []);

  useEffect(() => {
    if (!props.stream) return;

    setVideoTrack(props.stream.getVideoTracks()[0]);
    setAudioTrack(props.stream.getAudioTracks()[0]);
  }, [props.stream]);

  useEffect(() => {
    if (!props.pc) return;

    startStatsLoop(props.pc);
    onTrackAdded(props.pc);
  }, [props.pc, startStatsLoop, onTrackAdded])
  return <>
    <div className="Video-info">
      <p id="ICE">Conn State：{iceState}</p>
      <p id="Resolution">
        Resolution：
        {resolution === 'undefined*undefined'
          ? 'Reading..'
          : resolution}
      </p>
      <p id="FrameRate">
        Frame Rate：
        {frameRate === 'undefined'
          ? 'Reading..'
          : frameRate}
      </p>
      <p id="VideoBitrate">Video Bitrate：{codeRate}</p>
      <p id="Volume">Volume：{volume}</p>
      <p id="ErrorMessage" style={{color: 'red'}}>
        {props.errorMessage
          ? `Error message：${props.errorMessage}`
          : ''}
      </p>
    </div>
  </>
};
export default memo(VideoInfo);
