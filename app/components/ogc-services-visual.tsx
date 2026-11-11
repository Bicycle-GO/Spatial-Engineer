"use client";

import { useState } from "react";
import Link from "next/link";
import { ogcServices } from "../data/ogc-services";

function ServiceDiagram({serviceId}:{serviceId:string}) {
  const active=ogcServices.find(service=>service.id===serviceId)!;
  return <svg className="ogc-service-diagram" viewBox="0 0 420 245" role="img" aria-label={`${active.id} · ${active.focus}의 개념 예시`}>
    <rect x="5" y="5" width="410" height="235" rx="13" fill="#f7faf3"/>
    {serviceId==="WMS" && <>
      <rect x="65" y="28" width="290" height="162" rx="5" fill="#e7e1c3" stroke="#66835d" strokeWidth="2"/>
      <path d="M65 75L190 110L230 28H65ZM230 28L190 110L355 145V28Z" fill="#b7d4a3"/>
      <path d="M65 170L355 70" stroke="white" strokeWidth="10"/>
      <path d="M65 170L355 70" stroke="#b88f61" strokeWidth="2"/>
      <path d="M115 28L185 190" stroke="#84bad4" strokeWidth="11"/>
      <text x="210" y="220" textAnchor="middle" fontSize="19" fill="#35543d">서버가 표현한 지도 이미지</text>
    </>}
    {serviceId==="WFS" && <>
      <polygon points="35,50 155,35 185,154 55,172" fill="#bad5ab" stroke="#527c58" strokeWidth="3"/>
      <circle cx="104" cy="107" r="8" fill="#36694a"/>
      <text x="103" y="200" textAnchor="middle" fontSize="18" fill="#35543d">피처 도형</text>
      <path d="M195 107H221" stroke="#5b7755" strokeWidth="2"/>
      <rect x="235" y="53" width="155" height="113" rx="6" fill="white" stroke="#8ca480"/>
      <text x="251" y="83" fontSize="18" fill="#35543d">ID: 101</text>
      <text x="251" y="115" fontSize="18" fill="#35543d">지목: 전</text>
      <text x="251" y="146" fontSize="18" fill="#35543d">면적: 500m²</text>
      <text x="310" y="200" textAnchor="middle" fontSize="18" fill="#35543d">연결된 속성</text>
    </>}
    {serviceId==="WCS" && <>
      {[10,12,15,11,14,18,12,16,20].map((value,index)=><g key={index}><rect x={99+(index%3)*70} y={24+Math.floor(index/3)*55} width="70" height="55" fill={value<15?"#d4e3bc":"#a9c58e"} stroke="white" strokeWidth="2"/><text x={134+(index%3)*70} y={59+Math.floor(index/3)*55} textAnchor="middle" fontSize="23" fill="#31563a">{value}</text></g>)}
      <text x="205" y="220" textAnchor="middle" fontSize="19" fill="#35543d">DEM 예시 · 표고 값(m)</text>
    </>}
    {serviceId==="WPS" && <>
      <circle cx="66" cy="105" r="8" fill="#3a7352"/>
      <path d="M95 105H133M124 98L133 105L124 112M267 105H302M293 98L302 105L293 112" fill="none" stroke="#6d865c" strokeWidth="3"/>
      <rect x="148" y="68" width="106" height="75" rx="8" fill="white" stroke="#6b8d5e" strokeWidth="2"/>
      <text x="201" y="111" textAnchor="middle" fontSize="19" fill="#35543d">버퍼 처리</text>
      <circle cx="348" cy="105" r="42" fill="#cbdcb5" stroke="#648651" strokeWidth="2"/>
      <circle cx="348" cy="105" r="6" fill="#3a7352"/>
      <text x="66" y="189" textAnchor="middle" fontSize="18" fill="#35543d">입력</text>
      <text x="201" y="189" textAnchor="middle" fontSize="18" fill="#35543d">공개된 처리</text>
      <text x="348" y="189" textAnchor="middle" fontSize="18" fill="#35543d">결과</text>
    </>}
  </svg>;
}

export function OgcServicesVisual() {
  const [selected,setSelected]=useState("WMS");
  const active=ogcServices.find(service=>service.id===selected)!;
  return <div className="ogc-services-explorer">
    <div className="ogc-service-tabs" aria-label="OGC 서비스 비교">{ogcServices.map(service=><button type="button" key={service.id} aria-pressed={selected===service.id} onClick={()=>setSelected(service.id)}><strong>{service.id}</strong><span>{service.focus}</span></button>)}</div>
    <section className="ogc-service-detail"><span className="mini-kicker">{active.name}</span><h3>{active.id} · {active.focus}</h3><ServiceDiagram serviceId={active.id}/><p className="ogc-service-provides">{active.provides}</p><div className="ogc-service-cards"><section><h4>생활 속 예시</h4><p>{active.example}</p></section><section><h4>대표 요청</h4><p><code>{active.operation}</code></p><p>{active.caution}</p></section></div></section>
    <p className="ogc-service-note">역할을 설명하는 가상 개념도입니다. 서버의 제공 데이터·처리와 버전·CRS·출력 형식·권한은 서비스 설명에서 확인합니다. 이 네 가지 외에 WMTS 등 다른 OGC 표준도 있습니다.</p>
    <Link className="button primary ogc-service-practice" href="/engineer/practice/practical/?chapter=practical-ogc">네 가지 서비스 단답·사례 문제 풀기 →</Link>
  </div>;
}

export function OgcServicesSolution() {
  return <section className="ogc-services-solution" aria-label="네 OGC 웹서비스의 역할 비교"><h3>그림 · 객체 · 값 · 처리로 기억하기</h3><div className="ogc-service-summary">{ogcServices.map(service=><article key={service.id}><h4>{service.id}</h4><ServiceDiagram serviceId={service.id}/><strong>{service.name}</strong><p>{service.provides}</p></article>)}</div></section>;
}
