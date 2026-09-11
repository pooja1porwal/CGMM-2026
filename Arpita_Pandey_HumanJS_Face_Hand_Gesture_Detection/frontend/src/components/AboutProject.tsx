// Expandable academic project-info section. Native <details> keeps this dependency-free and
// accessible (keyboard/screen-reader toggle support comes for free) without extra state.
import './AboutProject.css'

export function AboutProject() {
  return (
    <details className="about-project">
      <summary>About Project / System Information</summary>

      <div className="about-project-content">
        <h3>Selected Academic Topic</h3>
        <p>Human.js (Face + Hand + Gesture Detection)</p>

        <h3>Implementation</h3>
        <p>
          SignSpeak AI applies real-time face and hand analysis to an accessibility-oriented Indian
          Sign Language fingerspelling application. Human.js performs client-side face detection
          and landmark tracking directly in the browser, while MediaPipe extracts hand landmarks
          server-side and a trained machine-learning classifier recognizes isolated A-Z gestures.
        </p>

        <h3>Core Features</h3>
        <ul>
          <li>Real-time face detection</li>
          <li>Face landmark tracking</li>
          <li>Real-time hand tracking</li>
          <li>Gesture/sign recognition</li>
          <li>ISL A-Z fingerspelling</li>
          <li>Text generation</li>
          <li>Text-to-speech</li>
          <li>Real-time WebSocket communication</li>
        </ul>

        <h3>Scope and Limitations</h3>
        <p>
          The current ML recognition supports isolated/static A-Z fingerspelling gestures only --
          it does not perform unrestricted continuous Indian Sign Language translation, and does
          not capture facial grammar, body pose, or dynamic (motion-based) signs.
        </p>
        <p>
          Face analysis is limited to detection and landmark visualization. It does not perform
          identity recognition, gender prediction, ethnicity prediction, or any surveillance
          functionality, regardless of what the underlying library technically supports.
        </p>

        <h3>Privacy</h3>
        <p>
          Camera frames are processed for real-time analysis. The application does not
          intentionally persist webcam images.
        </p>
      </div>
    </details>
  )
}
