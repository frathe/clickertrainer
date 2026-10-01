(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=28,t=5,n=120,r=4,i=.75;function a(){return{score:0,trackedSeconds:0,streakSeconds:0,awaySeconds:0}}function o(e){return 1+Math.min(r,e.streakSeconds/n)}function s(e){return t*o(e)}function c(e){let n=Math.min(e,480);return t*(e+n*n/240+r*Math.max(0,e-n))}function ee(e,t,n){let r=Math.max(0,t);if(!n){e.awaySeconds+=r,e.awaySeconds>i&&(e.streakSeconds=0);return}e.awaySeconds=0;let a=e.streakSeconds+r;e.score+=c(a)-c(e.streakSeconds),e.streakSeconds=a,e.trackedSeconds+=r}function te(e,t){return t!==null&&Math.hypot(t.x-e.x,t.y-e.y)<=e.radius+12}function ne(e){return{x:(e.left+e.right)/2,y:(e.top+e.bottom)/2,radius:46,phase:0}}function l(t,n,r){let i=(n.left+n.right)/2,a=(n.top+n.bottom)/2,o=Math.max(0,n.right-n.left)*.4,s=Math.max(0,n.bottom-n.top)*.35,c=e/Math.max(1,Math.hypot(o,s*.73));t.phase+=Math.max(0,r)*c,t.x=i+Math.sin(t.phase)*o,t.y=a+Math.sin(t.phase*.73)*s}var u=6,d=90,f=5,re=class{outgoing=0;incoming=0;transitionStarted=0;nextChange;random;constructor(e=Math.random){this.random=e,this.nextChange=this.interval()}at(e){let t=Math.max(0,e);for(;t>=this.nextChange;)this.outgoing=this.incoming,this.incoming=this.incoming+1<u?this.incoming+1:1,this.transitionStarted=this.nextChange,this.nextChange+=this.interval();let n=this.outgoing===this.incoming?1:Math.min(1,(t-this.transitionStarted)/f),r=n*n*(3-2*n);return{outgoing:this.outgoing,incoming:this.incoming,blend:r}}interval(){return d+this.random()*70}},ie=.9,p=[{css:`#ff65c9`,hue:.89},{css:`#a78bfa`,hue:.71},{css:`#54e4f5`,hue:.52},{css:`#73ecb0`,hue:.42},{css:`#709dff`,hue:.61},{css:`#ff4f91`,hue:.94}],ae=class{random;responseSeconds;nextAt=1/0;active=null;wave=null;constructor(e,t=Math.random){this.responseSeconds=e,this.random=t}start(e){this.nextAt=e+this.interval(),this.active=null,this.wave=null}advance(e){if(e>=this.nextAt){let t=p[Math.min(p.length-1,Math.floor(this.random()*p.length))];this.active={born:e,color:t},this.nextAt=e+this.interval()}return this.active&&e>this.active.born+this.responseSeconds&&(this.active=null),this.active?.color??null}click(e,t,n){let r=this.active;return!r||e<r.born||e>r.born+this.responseSeconds||Math.hypot(t.x-n.x,t.y-n.y)>n.radius?!1:(this.wave={born:e,center:{x:n.x,y:n.y},hue:r.color.hue},this.active=null,!0)}waveAt(e){if(!this.wave)return;let t=e-this.wave.born;if(!(t<0||t>.9))return{center:this.wave.center,hue:this.wave.hue,age:t}}interval(){return 60+this.random()*30}},oe=`
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`,m=`
precision highp float;

uniform vec2 uResolution;
uniform vec2 uCenter;
uniform vec2 uWaveCenter;
uniform float uWaveProgress;
uniform float uWaveHue;
uniform float uTime;
uniform float uSpin;
uniform float uPicfetchRotation;
uniform float uTight;
uniform float uIntensity;
uniform float uPulse;
uniform float uFlash;
uniform float uOutgoing;
uniform float uIncoming;
uniform float uBlend;

const float TAU = 6.28318530718;
const float SPIRAL_OVERSCAN = 2.25;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// Ported from PicFetch internal/ui/spiral/shader.go. Use a 600px reference
// height so ripple spacing is independent of viewport size and pixel ratio.
vec3 rippleSpiral(vec2 uv) {
  float radius = length(uv * 300.0) / 30.0;
  float angle = atan(uv.y, uv.x) * 4.0;
  float phase = angle + radius - uPicfetchRotation;
  float v = sin(phase);
  float hue = fract((v + 1.0) * 0.5 + uTime * 0.06);
  float val = 0.5 + 0.5 * v;
  return hsv2rgb(vec3(hue, 0.9, val));
}

vec3 nautilusSpiral(vec2 uv) {
  float r = length(uv);
  float theta = atan(uv.y, uv.x);
  // Render a virtual spiral 2.25 times the viewport size. Even with its
  // center at a screen edge, all visible corners stay inside its winding area.
  // Continue the power-law beyond that area instead of clamping into spokes.
  float rMax = length(uResolution) * SPIRAL_OVERSCAN / min(uResolution.x, uResolution.y);
  float u = max(r / rMax, 0.0);
  float turns = 30.0 / 10.0;

  vec3 result = vec3(0.02, 0.01, 0.04);
  for (int i = 0; i < 4; i++) {
    float layerT = float(i) / 3.0;
    float curve = 2.0 + layerT * 1.2;
    float spiralAngle = pow(u, 1.0 / curve) * (turns + layerT) * TAU;
    float layerRotation = uPicfetchRotation * (0.75 - layerT);
    float phase = theta - spiralAngle - layerRotation;
    float armPos = fract(phase * 4.0 / TAU);
    float band = smoothstep(0.0, 0.05, armPos) - smoothstep(0.32, 0.37, armPos);
    band = clamp(band, 0.0, 1.0);
    float hue = fract(u * 0.5 + layerT * 0.18 + uTime * 0.06);
    vec3 layerColor = hsv2rgb(vec3(hue, 0.85, 1.0)) * band;
    result = max(result, layerColor);
  }
  return result;
}

vec3 palette(float phase) {
  // A continuous color wheel: violet, rose, gold, turquoise, and blue.
  return 0.54 + 0.40 * cos(phase + vec3(0.0, 2.1, 4.2));
}

vec3 coilSpiral(vec2 uv) {
  float r = length(uv);
  float a = atan(uv.y, uv.x);
  float safeR = max(r, 0.18);
  float logR = log(safeR);
  const float arms = 5.0;

  float phase = arms * (a + uTime * uSpin) - logR * uTight;
  float band = sin(phase);
  float shade = smoothstep(0.0, 1.0, band * 0.5 + 0.5);

  // Angular frequencies must be integers so atan's -PI/PI wrap is invisible.
  float phase2 = 3.0 * (a - uTime * uSpin * 0.62) - logR * (uTight * 0.68);
  float filament = sin(phase2) * 0.5 + 0.5;
  float hue = a - logR * 1.25 - uTime * 0.065;
  vec3 ribbon = palette(hue + filament * 0.45);
  vec3 sheen = palette(hue + 0.85);

  vec3 ink = vec3(0.025, 0.018, 0.065);
  vec3 shadow = ink + ribbon * 0.075;
  vec3 col = mix(shadow, ribbon, shade * 0.88);
  col = mix(col, sheen, filament * shade * 0.22);

  float eye = 1.0 - smoothstep(0.06, 0.36, r);
  col = mix(col, ink, eye * 0.92);

  float vig = 1.0 - smoothstep(0.28, 1.9, r);
  col *= mix(0.76, 1.0, vig);
  return col;
}

// Broad, luminous ribbons weave around a continuously winding rainbow vortex.
vec3 auroraSpiral(vec2 uv) {
  float r = length(uv);
  float a = atan(uv.y, uv.x) + uPicfetchRotation * 0.14;
  float phase = 4.0 * a - r * 8.0 + 0.65 * sin(2.0 * a - r * 2.5);
  float ribbon = smoothstep(-0.7, 0.85, sin(phase));
  float filament = pow(0.5 + 0.5 * cos(phase + r * 1.6), 6.0);
  float hue = fract(a / TAU + r * 0.13 + uTime * 0.025);
  vec3 color = hsv2rgb(vec3(hue, 0.78, 0.94));
  vec3 sheen = hsv2rgb(vec3(fract(hue + 0.16), 0.55, 0.98));
  vec3 col = mix(vec3(0.025, 0.015, 0.075) + color * 0.08, color, ribbon);
  col = mix(col, sheen, filament * ribbon * 0.40);
  return mix(vec3(0.025, 0.015, 0.075), col, smoothstep(0.0, 0.045, r));
}

// Interleaved logarithmic helices: jewel-colored bands and counter-turning silk.
vec3 prismSpiral(vec2 uv) {
  float r = length(uv);
  float a = atan(uv.y, uv.x);
  float winding = log(max(r, 0.025));
  float phase = 6.0 * a - winding * 9.0 - uPicfetchRotation * 0.65;
  float counterPhase = 3.0 * a + winding * 5.0 + uPicfetchRotation * 0.32;
  float ribbon = smoothstep(-0.35, 0.65, sin(phase));
  float silk = smoothstep(0.0, 1.0, 0.5 + 0.5 * sin(counterPhase));
  float hue = fract(a / TAU - winding * 0.16 + uTime * 0.025);
  vec3 color = hsv2rgb(vec3(hue, 0.84, 0.95));
  vec3 counterColor = hsv2rgb(vec3(fract(hue + 0.33), 0.72, 0.88));
  vec3 col = mix(vec3(0.02, 0.012, 0.065), color, ribbon * 0.9);
  col = mix(col, counterColor, silk * (0.18 + ribbon * 0.27));
  return mix(vec3(0.02, 0.012, 0.065), col, smoothstep(0.015, 0.10, r));
}

// Curving petal-shaped arms open into a flower that keeps winding past the edges.
vec3 bloomSpiral(vec2 uv) {
  float r = length(uv);
  float a = atan(uv.y, uv.x) - uPicfetchRotation * 0.12;
  float phase = 5.0 * a - r * 9.0 + 1.25 * sin(3.0 * a - r * 2.0);
  float petal = smoothstep(-0.8, 0.85, sin(phase));
  float edge = pow(0.5 + 0.5 * sin(phase + 0.75), 8.0);
  float hue = fract(a / TAU + r * 0.10 - uTime * 0.022);
  vec3 color = hsv2rgb(vec3(hue, 0.82, 0.94));
  vec3 rim = hsv2rgb(vec3(fract(hue + 0.20), 0.60, 0.98));
  vec3 col = mix(vec3(0.03, 0.012, 0.055) + color * 0.10, color, petal);
  col = mix(col, rim, edge * petal * 0.45);
  return mix(vec3(0.03, 0.012, 0.055), col, smoothstep(0.0, 0.055, r));
}

vec3 spiralColor(float pattern, vec2 uv) {
  if (pattern < 0.5) return coilSpiral(uv);
  if (pattern < 1.5) return rippleSpiral(uv);
  if (pattern < 2.5) return nautilusSpiral(uv);
  if (pattern < 3.5) return auroraSpiral(uv);
  if (pattern < 4.5) return prismSpiral(uv);
  return bloomSpiral(uv);
}

void main() {
  // All patterns share the marker origin, including both sides of a dissolve.
  vec2 uv = (gl_FragCoord.xy - uCenter * uResolution) * 2.0 / min(uResolution.x, uResolution.y);
  float zoom = 1.0 + uPulse * 0.085;
  uv /= zoom;

  vec3 col = spiralColor(uIncoming, uv);
  if (uBlend < 1.0) {
    // The incoming spiral fills the background while the outgoing one
    // becomes translucent and vanishes. Both keep animating during the fade.
    col = mix(spiralColor(uOutgoing, uv), col, uBlend);
  }
  col *= mix(0.9, 1.05, uIntensity);

  float contrast = 1.0 + uIntensity * 0.16;
  contrast += uPulse * 0.36;
  col = (col - 0.4) * contrast + 0.4;

  if (uWaveProgress >= 0.0 && uWaveProgress <= 1.0) {
    // The expanding rainbow ring widens as it travels, with a gentle 20% blend.
    float unit = min(uResolution.x, uResolution.y);
    vec2 waveUV = (gl_FragCoord.xy - uWaveCenter * uResolution) / unit;
    vec2 farCorner = max(uWaveCenter, vec2(1.0) - uWaveCenter) * uResolution;
    float reach = length(farCorner) / unit + 0.20;
    float progress = uWaveProgress * (2.0 - uWaveProgress);
    float radius = reach * progress;
    float halfWidth = mix(0.008, 0.16, progress * progress);
    float band = 1.0 - smoothstep(halfWidth * 0.45, halfWidth, abs(length(waveUV) - radius));
    float envelope = smoothstep(0.0, 0.04, uWaveProgress)
      * (1.0 - smoothstep(0.85, 1.0, uWaveProgress));
    float hue = fract(uWaveHue + atan(waveUV.y, waveUV.x) / TAU + uWaveProgress * 0.15);
    vec3 waveColor = hsv2rgb(vec3(hue, 0.75, 0.85));
    col = mix(col, waveColor, band * envelope * 0.20);
  }

  col = mix(col, vec3(1.0, 0.97, 0.92), uFlash * 0.68);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`,h=2.2,se=.2,ce=.32,le=class{canvas;supported;gl=null;program=null;resolution={x:1,y:1};loc={};shownIntensity=.1;shownTight=2.3;shownSpin=.09;primed=!1;cycle=new re;picfetchRotation=0;constructor(e){this.canvas=e;let t=e.getContext(`webgl`,{alpha:!1,antialias:!1,depth:!1,stencil:!1,powerPreference:`high-performance`});if(!t){this.supported=!1;return}this.gl=t,this.supported=this.link(t)}draw(e,t,n,r=t){let i=this.gl,a=this.program;if(!i||!a||i.isContextLost())return this.supported=!1,!1;this.resize(i),this.smooth(e,n),this.picfetchRotation+=Math.max(0,e)*h,i.useProgram(a),i.uniform2f(this.loc.uResolution,this.resolution.x,this.resolution.y),i.uniform2f(this.loc.uCenter,n.center?n.center.x/Math.max(1,this.canvas.clientWidth):.5,n.center?1-n.center.y/Math.max(1,this.canvas.clientHeight):.5),i.uniform2f(this.loc.uWaveCenter,n.wave?n.wave.center.x/Math.max(1,this.canvas.clientWidth):.5,n.wave?1-n.wave.center.y/Math.max(1,this.canvas.clientHeight):.5),i.uniform1f(this.loc.uWaveProgress,n.wave?n.wave.age/ie:-1),i.uniform1f(this.loc.uWaveHue,n.wave?.hue??0),i.uniform1f(this.loc.uTime,t),i.uniform1f(this.loc.uPicfetchRotation,this.picfetchRotation),i.uniform1f(this.loc.uSpin,this.shownSpin),i.uniform1f(this.loc.uTight,this.shownTight),i.uniform1f(this.loc.uIntensity,this.shownIntensity),i.uniform1f(this.loc.uPulse,n.pulse),i.uniform1f(this.loc.uFlash,n.flash);let o=this.cycle.at(r);return i.uniform1f(this.loc.uOutgoing,o.outgoing),i.uniform1f(this.loc.uIncoming,o.incoming),i.uniform1f(this.loc.uBlend,o.blend),i.drawArrays(i.TRIANGLES,0,3),!0}smooth(e,t){let n=Math.min(Math.max(e,0),.05),r=2.25+t.intensity*2.35,i=Math.min(se,.085+t.intensity*.1);if(!this.primed){this.shownTight=r,this.shownSpin=i,this.shownIntensity=t.intensity,this.primed=!0;return}let a=1-Math.exp(-n*1.35),o=this.shownTight+(r-this.shownTight)*a,s=ce*n,c=Math.max(-s,Math.min(s,o-this.shownTight));this.shownTight+=c,this.shownSpin+=(i-this.shownSpin)*a,this.shownIntensity+=(t.intensity-this.shownIntensity)*a}resize(e){let t=Math.min(window.devicePixelRatio||1,1.5),n=Math.max(1,Math.floor(this.canvas.clientWidth*t)),r=Math.max(1,Math.floor(this.canvas.clientHeight*t));(this.canvas.width!==n||this.canvas.height!==r)&&(this.canvas.width=n,this.canvas.height=r,this.resolution.x=n,this.resolution.y=r,e.viewport(0,0,n,r))}link(e){let t=g(e,e.VERTEX_SHADER,oe),n=g(e,e.FRAGMENT_SHADER,m);if(!t||!n)return!1;let r=e.createProgram();if(!r)return!1;if(e.attachShader(r,t),e.attachShader(r,n),e.bindAttribLocation(r,0,`aPos`),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))return console.error(e.getProgramInfoLog(r)),!1;let i=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),this.program=r;for(let t of[`uResolution`,`uCenter`,`uWaveCenter`,`uWaveProgress`,`uWaveHue`,`uTime`,`uPicfetchRotation`,`uSpin`,`uTight`,`uIntensity`,`uPulse`,`uFlash`,`uOutgoing`,`uIncoming`,`uBlend`])this.loc[t]=e.getUniformLocation(r,t);return!0}};function g(e,t,n){let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),e.deleteShader(r),null)):null}var _=class{context=null;buffer=null;loading=null;url;gain;constructor(e,t){this.url=e,this.gain=t}unlock(){if(!this.context){let e=window.AudioContext;if(!e)return;try{this.context=new e}catch{return}}let e=this.context;e.state===`suspended`&&e.resume().catch(()=>{}),!this.buffer&&!this.loading&&(this.loading=this.load(e).finally(()=>{this.loading=null}))}play(e=0){this.unlock();let t=this.context,n=this.buffer;t&&n&&t.state!==`closed`&&(t.state===`running`?this.playBuffer(t,n,e):t.resume().then(()=>this.playBuffer(t,n,e)).catch(()=>{}))}async load(e){try{let t=await fetch(this.url);if(!t.ok)return;this.buffer=await e.decodeAudioData(await t.arrayBuffer())}catch{}}playBuffer(e,t,n){let r=e.createBufferSource();r.buffer=t;let i=e.createGain();i.gain.value=this.gain,r.connect(i),i.connect(e.destination),r.onended=()=>{r.disconnect(),i.disconnect()},r.start(e.currentTime+Math.max(0,n))}},ue=.8,v=class{count=0;clearAt=null;collect(e){return this.advance(e),this.clearAt!==null||(this.count+=1,this.count<5)?!1:(this.clearAt=e+ue,!0)}advance(e){this.clearAt!==null&&e>=this.clearAt&&(this.count=0,this.clearAt=null)}},de=new Intl.NumberFormat(`en-US`),fe=1;function y(e,t){if(e==null)throw Error(`Coil markup is missing ${t}.`);return e}var b=y(document.querySelector(`#gl`),`#gl`),x=y(document.querySelector(`#hud`),`#hud`),S=y(document.querySelector(`#gate`),`#gate`),C=y(document.querySelector(`#veil`),`#veil`),w=y(document.querySelector(`#bones`),`#bones`),T=[...w.querySelectorAll(`.bone`)],E=y(document.querySelector(`#score`),`#score`),D=y(document.querySelector(`#boost`),`#boost`),O=y(document.querySelector(`#gain`),`#gain`),k=y(document.querySelector(`#target`),`#target`),A=y(k.querySelector(`.face`),`.face`),j=y(document.querySelector(`#live`),`#live`),pe=y(document.querySelector(`#begin`),`#begin`),M=new le(b),N=new ae(fe),P=new _(`/hypno-game-play/audio/dog-clicker.wav`,.4),F=new _(`/hypno-game-play/audio/good-dog.mp3`,.55),I=new v,L=!1,R=a(),z=null,B=null,V=null,H=!1,U=performance.now(),W=U,G=0;M.supported||(S.hidden=!0,C.hidden=!1,j.textContent=`WebGL is unavailable, so Coil cannot start.`),pe.addEventListener(`click`,me),window.addEventListener(`pointerdown`,e=>{if(!L||!e.isPrimary)return;e.pointerType!==`mouse`&&(V=e.pointerId),K(e);let t=performance.now()/1e3;if(z&&N.click(t,{x:e.clientX,y:e.clientY},z)){P.play(),X(null);let e=I.collect(t);Y(),e?(F.play(.28),j.textContent=`Good dog. Five bones collected.`):j.textContent=`${I.count} of 5 bones collected.`}}),window.addEventListener(`pointermove`,K),window.addEventListener(`pointerup`,e=>{e.pointerType!==`mouse`&&e.pointerId===V&&q()}),window.addEventListener(`pointercancel`,q),window.addEventListener(`pointerout`,e=>{e.relatedTarget===null&&q()}),window.addEventListener(`blur`,q),document.addEventListener(`visibilitychange`,()=>{document.hidden&&q()}),window.addEventListener(`resize`,()=>{L&&z&&(l(z,Z(),0),Q())});function K(e){L&&e.isPrimary&&(e.pointerType===`mouse`||V===e.pointerId)&&(B={x:e.clientX,y:e.clientY})}function q(){B=null,V=null}function me(){M.supported&&!L&&(L=!0,W=performance.now(),R=a(),N.start(performance.now()/1e3),P.unlock(),F.unlock(),Y(),document.body.classList.add(`playing`),S.hidden=!0,C.hidden=!0,x.hidden=!1,z=ne(Z()),Q(),$(),j.textContent=`Follow the dot with your cursor, or keep your finger on it. Points build while you follow.`)}function J(e){let t=Math.max(0,(e-U)/1e3),n=document.hidden?0:Math.min(.05,t);U=e;let r=document.hidden?0:Math.min(.25,t);if(G+=r,L&&z&&!document.hidden){l(z,Z(),n),X(N.advance(e/1e3)),I.advance(e/1e3),Y();let t=te(z,B);ee(R,n,t),t!==H&&(H=t,j.textContent=H?`Following. Points are building.`:`Follow the dot to keep building points.`),k.classList.toggle(`tracking`,H),Q(),$()}!M.draw(r,G,{intensity:.12,pulse:0,flash:0,center:z??void 0,wave:N.waveAt(e/1e3)},L?(e-W)/1e3:0)&&C.hidden&&(L=!1,z=null,q(),k.hidden=!0,x.hidden=!0,S.hidden=!0,C.hidden=!1,document.body.classList.remove(`playing`),j.textContent=`The WebGL context was lost.`),requestAnimationFrame(J)}requestAnimationFrame(J);function Y(){let e=`${I.count} of 5 bones`;w.getAttribute(`aria-label`)!==e&&(w.setAttribute(`aria-label`,e),w.classList.toggle(`complete`,I.count===5),T.forEach((e,t)=>e.classList.toggle(`filled`,t<I.count)))}function X(e){k.classList.toggle(`cue`,e!==null),e&&k.style.setProperty(`--cue-color`,e.css)}function Z(){let e=(z?.radius??46)+12+20,t=window.innerWidth/2,n=window.innerHeight/2;return{left:Math.min(e,t),right:Math.max(window.innerWidth-e,t),top:Math.min(x.getBoundingClientRect().bottom+e,n),bottom:Math.max(window.innerHeight-e,n)}}function Q(){if(!z)return;let e=z.radius*2,t=e+24;k.hidden=!1,k.style.width=`${t}px`,k.style.height=`${t}px`,A.style.width=`${e}px`,A.style.height=`${e}px`,k.style.transform=`translate3d(${z.x}px, ${z.y}px, 0) translate(-50%, -50%)`}function $(){let e=de.format(Math.floor(R.score)),t=`×${o(R).toFixed(1)}`,n=H?`+${Math.round(s(R))} / s`:`Follow the dot`;E.textContent!==e&&(E.textContent=e),D.textContent!==t&&(D.textContent=t),O.textContent!==n&&(O.textContent=n),document.title=`Coil · ${e}`}