precision highp float;
uniform sampler2D tMap;
uniform sampler2D tFlow;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  vec4 flow = texture2D(tFlow, uv + uTime * 0.015);
  float strength = uHover * 0.07;
  vec2 flowOffset = (flow.rg - 0.5) * strength;

  vec2 toMouse = uMouse - uv;
  float mouseDist = length(toMouse);
  float mouseForce = smoothstep(0.4, 0.0, mouseDist) * uHover * 0.05;
  vec2 mouseOffset = normalize(toMouse + 0.001) * (-mouseForce);

  vec4 color = texture2D(tMap, uv + flowOffset + mouseOffset);

  float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  float saturation = 0.3 + uHover * 0.7;
  color.rgb = mix(vec3(luma), color.rgb, saturation);

  gl_FragColor = color;
}
