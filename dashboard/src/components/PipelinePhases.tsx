import { pipelinePhases } from '../data';

export default function PipelinePhases() {
  return (
    <div className="pipeline-phases" id="pipeline-overview">
      {pipelinePhases.map((p) => (
        <div key={p.phase} className={`pipeline-phase ${p.status}`}>
          <span className="pipeline-phase-number">Phase {p.phase}</span>
          {p.name}
        </div>
      ))}
    </div>
  );
}
