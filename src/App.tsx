import {useCallback, useEffect, useState, memo, useMemo} from 'react';
import {
  Button,
  Space,
  Switch,
  Input,
  Message,
  PageHeader,
} from "@arco-design/web-react";
import { v4 as uuid } from "uuid";
import {generateToken, getUrlPrmt} from './util';
import Subscriber from './Subscriber';
import Publisher from './Subscriber';
import './App.css';
import {IconRefresh, IconVideoCamera, IconVoice} from '@arco-design/web-react/icon';

function App() {
  const queryObject = getUrlPrmt();

  const [ mode, setMode ] = useState("push");
  const [ AppID, setAppID ] = useState(queryObject.AppID || "bc22d5");
  const [ AppKey, setAppKey ] = useState(queryObject.AppKey || "00eec858271ea752");
  const [ StreamID, setStreamID ] = useState(queryObject.StreamID || uuid());

  const [ token, setToken ] = useState("");

  const streamContainer = useMemo(() => {
    if (mode === 'push') {
      return <Publisher appId={AppID} streamId={StreamID} appKey={AppKey} token={token} ></Publisher>
    } else {
      return <Subscriber appId={AppID} streamId={StreamID} appKey={AppKey} token={token} ></Subscriber>
    }
  }, [mode, AppID, AppKey, StreamID, token])


  return (
    <div className="Page">
      <PageHeader title="Welcome to the WTN Demo" className="Header" />
      <div className="Contrainer">
        { token ? streamContainer : <></>}
      </div>
    </div>
  );
}

export default memo(App);
