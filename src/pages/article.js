import React, { useState, useEffect } from 'react'
import request from '../utils/request'
import hljs from 'highlight.js';
import { Row, Col } from 'antd'
import { getDay } from '../utils/time'
import Tag from '../components/Tag'

import 'highlight.js/styles/atelier-plateau-light.css';
// import 'highlight.js/scss/default.scss'
// // 引入个性化的vs2015样式
// import 'highlight.js/styles/vs2015.css'

const Article = (props) =>{
  const { id } = props.match.params;
  console.info(props)
  const [title, setTitle]= useState('')
  const [tags, setTags]= useState('')
  const [text, setText]= useState('')
  const [date, setDate]= useState('')

  const md = require('markdown-it')({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return '<pre class="hljs"><code>' +
            hljs.highlight(lang, str, true).value +
            '</code></pre>';
        } catch (__) {}
      }
      return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
  }).use(require('markdown-it-multimd-table'));

  useEffect( () => {
    request.get(`articles/find_by_id/${id}`)
      .then(body => {
        const { data, ok } = body
        console.info(body)
        if (ok) {
          setTitle(data.title)
          setText(data.text)
          setTags(data.tags)
          setDate(data.created_at)
        }
      })
  }, [id])

  return(
    <div style={{background: '#fff', padding: '30px', borderRadius: '5px'}}>
      <div className="title2" style={{ fontSize: '25px', textAlign: 'left'}}>
        <span >{title}</span>
      </div>
      <Row style={{ margin: '10px 0 20px 0' }}>
        {tags.split(",").map( v => <Tag key={v} data={v} /> )}
        <span style={{ color: '#6c757d!important', textAlign:"right" }}>更新于&nbsp; {getDay(date)}</span>
      </Row>

      <div dangerouslySetInnerHTML = {{__html: md.render(text)}}></div>
      <style jsx>
        {`
          @media screen and (max-width: 2000px) {
          }
          @media screen and (max-width: 400px) {
          }

          .title2{
            font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
            color: #212529;
          }
         .card-row{
            font-size: 60px;
            margin-bottom: 30px;
            color:#000;
          }

        pre.hljs {
          padding: 8px 2px;
          border-radius: 5px;
          background: #f5f2f0;
          position: relative;
        }
         pre.hljs ol{
            list-style: decimal;
            margin: 0;
            margin-left: 40px;
            padding: 0;
          }
          pre.hljs ol li{
            position: relative;
            padding-left: 10px;
          }

          pre.hljs ol li.line-num {
            position: absolute;
            left: -40px;
            top: 0;
            width: 40px;
            height: 100%;
            border-right: 1px solid rgba(0, 0, 0, .66);
          }
          pre.hljs b.name {
            position: absolute;
            top: 2px;
            right: 12px;
            z-index: 10;
            color: #999;
            pointer-events: none;
          }
      `}
      </style>
    </div>
  )
}
export default Article


