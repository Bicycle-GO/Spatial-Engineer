export function Terrain() {
  const lines = Array.from({ length: 14 }, (_, i) => i);
  return <div className="terrain" aria-hidden="true">
    <div className="terrain-coordinate">37°33′59.4″N &nbsp; 126°58′41.0″E</div>
    <svg viewBox="0 0 520 340" fill="none">
      <defs>
        <linearGradient id="surface" x1="150" y1="80" x2="350" y2="300" gradientUnits="userSpaceOnUse"><stop stopColor="#E0EBD9"/><stop offset="1" stopColor="#9BC2AC"/></linearGradient>
        <linearGradient id="edge" x1="80" y1="210" x2="350" y2="320" gradientUnits="userSpaceOnUse"><stop stopColor="#A6C8B3"/><stop offset="1" stopColor="#4F8D71"/></linearGradient>
      </defs>
      <ellipse cx="274" cy="285" rx="165" ry="27" fill="#245D41" opacity=".06" />
      <path d="m62 225 219-119 193 116-219 113L62 225Z" fill="#D5E1CE" stroke="#AEC6B1"/>
      <path d="m62 207 219-119 193 116-219 113L62 207Z" fill="#E8EEDD" stroke="#ABC5AF"/>
      <path d="m62 187 219-119 193 116v19L255 316 62 206v-19Z" fill="url(#edge)" stroke="#7DA68B"/>
      <path d="m62 187 219-119 193 116-219 113L62 187Z" fill="url(#surface)" stroke="#7DA68B"/>
      <g stroke="#64967B" strokeWidth=".8" opacity=".55">
        {lines.map(i => <path key={`a${i}`} d={`M${75 + i * 14.8} ${194 + i * 8.5} Q${170 + i * 10} ${130 + i * 7 - Math.sin(i / 3) * 35} ${295 + i * 12.7} ${77 + i * 7.7}`}/>)}
        {lines.map(i => <path key={`b${i}`} d={`M${77 + i * 15} ${179 - i * 8.1} Q${204 + i * 9} ${234 - i * 9 - Math.sin(i / 2.8) * 62} ${269 + i * 14.7} ${290 - i * 7.7}`}/>)}
      </g>
      <path d="M134 196c28-6 22-26 55-26s25 16 52 5 22-39 54-34 23 36 62 32 42-14 62-6" stroke="#F7FAF1" strokeWidth="8"/>
      <path d="M134 196c28-6 22-26 55-26s25 16 52 5 22-39 54-34 23 36 62 32 42-14 62-6" stroke="#185C47" strokeWidth="2" strokeDasharray="4 5"/>
      <ellipse cx="294" cy="141" rx="16" ry="8" fill="#185C47" opacity=".16"/>
      <path d="M294 142s-22-27-22-43a22 22 0 0 1 44 0c0 16-22 43-22 43Z" fill="#185C47"/>
      <circle cx="294" cy="98" r="8" fill="#ECF3DC"/>
      <circle cx="133" cy="196" r="5" fill="#F7FAF1" stroke="#185C47" strokeWidth="2"/>
      <path d="M65 86h20M75 76v20M448 276h20M458 266v20" stroke="#7C9C86"/>
      <path d="M394 49v30m-5-23 5-8 5 8" stroke="#688571"/><text x="390" y="40" fill="#688571" fontSize="11" fontFamily="monospace">N</text>
    </svg>
    <div className="terrain-label"><span className="live-dot"/> YOUR NEXT COORDINATE</div>
    <div className="terrain-chip"><span>위치</span><i>+</i><span>데이터</span><i>=</i><strong>가능성</strong></div>
  </div>;
}
