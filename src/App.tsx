import { useState, useEffect, useMemo } from 'react';
import {
  PageHeader,
  Grid, Input, Space,
} from '@arco-design/web-react';
import { v4 as uuid } from "uuid";
import { generateToken, getUrlPrmt } from './util';
import Publisher from './Publisher';
import Subscriber from './Subscriber';
import {IconRefresh} from '@arco-design/web-react/icon';

import './App.css';

const Row = Grid.Row;
const Col = Grid.Col;

function App() {
  const queryObject = getUrlPrmt();

  const [ mode, setMode ] = useState(queryObject.mode || "push");
  const [ AppID, setAppID ] = useState(queryObject.AppID || "bc22d5");
  const [ AppKey, setAppKey ] = useState(queryObject.AppKey || "00eec858271ea752");
  const [ StreamID, setStreamID ] = useState(queryObject.StreamID || uuid());
  const [ pubToken, setPubToken ] = useState("");
  const [ subToken, setSubToken ] = useState("");


  useEffect(() => {
    if (mode === 'push') {
      generateToken({
        AppID,
        StreamID,
        Action: "pub",
        PullAuth: true,
        AppKey,
      }).then((token) => setPubToken(token))
    } else {
      generateToken({
        AppID,
        StreamID,
        Action: "sub",
        AppKey,
      }).then((token) => setSubToken(token))
    }

  }, [AppID, StreamID, AppKey, mode])
  return (
    <div className="Page">
      <PageHeader title="Welcome to the WTN Demo" className="Header" style={{color: '#FFF'}} />

      <Row justify='center'>
          <div className="Basic-message">
            <span style={{color: '#FFF'}}>StreamID：</span>
          </div>
          <Input
            id="StreamID"
            style={{width: 300, marginRight: 10}}
            value={StreamID}
            onChange={(v) => setStreamID(v)}
            placeholder="StreamID"
            suffix={<IconRefresh onClick={() => setStreamID(uuid())}/>}
          />
      </Row>
      <Space direction='vertical' />

      <Row justify='center'>

        {
          pubToken ?
            <Col style={{border: '1px solid #FFF'}} span={8} >
              <Publisher appId={AppID} streamId={StreamID} appKey={AppKey} token={pubToken}></Publisher>
            </Col> : <></>
        }
        {
          subToken || true ?
          <Col style={{border: '1px solid #FFF'}} span={8} offset={1}>
            <Subscriber appId={AppID} streamId={StreamID} appKey={AppKey} token={subToken}></Subscriber>
          </Col> : <></>
        }
      </Row>
    </div>
  );
}

export default App;
