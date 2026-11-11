"use client";

import { useId, useState } from "react";
import Link from "next/link";

const presets = [
  {name:"식생 예시",nir:0.60,red:0.20,text:"근적외선 반사도가 적색보다 높게 나타난 가상 식생 화소입니다."},
  {name:"두 반사도가 같을 때",nir:0.30,red:0.30,text:"차이는 0이고 합은 양수이므로 NDVI를 0으로 계산할 수 있습니다."},
  {name:"음수 예시",nir:0.03,red:0.07,text:"근적외선 반사도가 적색보다 낮으면 NDVI가 음수가 됩니다. 이 값 하나만으로 지표 종류를 확정하지 않습니다."},
];

function ReflectanceDiagram({nir,red}:{nir:number;red:number}) {
  return <svg className="ndvi-diagram" viewBox="0 0 420 235" role="img" aria-label={`적색 반사도 ${red.toFixed(2)}, 근적외선 반사도 ${nir.toFixed(2)}의 막대 비교`}>
    <rect x="5" y="5" width="410" height="225" rx="13" fill="#f7faf3"/>
    <text x="24" y="35" fontSize="17" fill="#405a43">같은 화소 · 무차원 반사도</text>
    <text x="24" y="76" fontSize="18" fontWeight="650" fill="#a7523e">적색 Red</text>
    <rect x="24" y="89" width="280" height="27" rx="4" fill="#ebeee5"/>
    <rect x="24" y="89" width={280*red} height="27" rx="4" fill="#bd6f56"/>
    <text x="323" y="110" fontSize="20" fill="#a7523e">{red.toFixed(2)}</text>
    <text x="24" y="153" fontSize="18" fontWeight="650" fill="#27634c">근적외선 NIR</text>
    <rect x="24" y="166" width="280" height="27" rx="4" fill="#ebeee5"/>
    <rect x="24" y="166" width={280*nir} height="27" rx="4" fill="#478567"/>
    <text x="323" y="187" fontSize="20" fill="#27634c">{nir.toFixed(2)}</text>
    <text x="24" y="219" fontSize="14" fill="#596b53">0</text><text x="295" y="219" fontSize="14" fill="#596b53">1</text>
  </svg>;
}

export function NdviVisual() {
  const id = useId();
  const [nir,setNir] = useState(0.60);
  const [red,setRed] = useState(0.20);
  const denominator = nir+red;
  const result = denominator>0 ? (nir-red)/denominator : null;
  return <div className="ndvi-explorer">
    <div className="ndvi-presets" aria-label="반사도 예시 선택">{presets.map(preset=><button type="button" key={preset.name} aria-pressed={nir===preset.nir && red===preset.red} onClick={()=>{setNir(preset.nir);setRed(preset.red);}}>{preset.name}</button>)}</div>
    <ReflectanceDiagram nir={nir} red={red}/>
    <div className="ndvi-controls">
      <label htmlFor={`${id}-nir`}>근적외선 반사도 <strong>{nir.toFixed(2)}</strong><input id={`${id}-nir`} type="range" min="0" max="1" step="0.01" value={nir} onChange={event=>setNir(Number(event.target.value))}/></label>
      <label htmlFor={`${id}-red`}>적색 반사도 <strong>{red.toFixed(2)}</strong><input id={`${id}-red`} type="range" min="0" max="1" step="0.01" value={red} onChange={event=>setRed(Number(event.target.value))}/></label>
    </div>
    <section className="ndvi-result" aria-live="polite"><span className="mini-kicker">차이 ÷ 합</span><p>({nir.toFixed(2)} − {red.toFixed(2)}) ÷ ({nir.toFixed(2)} + {red.toFixed(2)})</p><strong>{result===null ? "분모가 0이라 계산할 수 없어요" : `NDVI = ${result.toFixed(2)}`}</strong><p>{result===null ? "0/0은 유효한 NDVI 0과 구분합니다. 결측·유효성 처리 규칙을 적용하세요." : "NDVI는 무차원 지수입니다. 식생 면적의 비율(%)과 구분하세요."}</p></section>
    <section className="ndvi-case"><h3>왜 잎을 비교할까요?</h3><p>잎은 일반적으로 적색광을 흡수하고 근적외선을 상대적으로 많이 반사합니다. 두 반응의 차이를 합으로 나누어 식생을 살펴보는 단서를 만듭니다.</p><p>{presets.find(preset=>preset.nir===nir && preset.red===red)?.text ?? "값을 바꾸며 근적외선과 적색의 차이, 분모의 크기, NDVI 부호를 비교하세요."}</p></section>
    <p className="ndvi-note">가상 반사도 예시입니다. 관측 시기·식생 종류·구름·대기·토양의 영향과 센서별 밴드·제품 스케일을 함께 확인합니다.</p>
    <Link className="button primary ndvi-practice-link" href="/engineer/practice/practical/?chapter=practical-ndvi">단답·계산 예상문제 풀기 →</Link>
  </div>;
}

export function NdviSolution() {
  return <section className="ndvi-solution" aria-label="NDVI 식의 그림 해설"><h3>근적외선과 적색의 ‘차이 ÷ 합’</h3><ReflectanceDiagram nir={0.60} red={0.20}/><p className="ndvi-formula">NDVI = (NIR − Red) / (NIR + Red)<br/>= (0.60 − 0.20) / (0.60 + 0.20)<br/>= 0.40 / 0.80 = <strong>0.50</strong></p><p>이 그림은 분모가 양수인 계산 예시입니다. 두 반사도가 모두 0이면 식을 계산할 수 없습니다.</p></section>;
}
