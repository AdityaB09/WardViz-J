CREATE TABLE IF NOT EXISTS note(
  id UUID PRIMARY KEY,
  patient_id VARCHAR(64) NOT NULL,
  ts TIMESTAMP WITH TIME ZONE NOT NULL,
  text TEXT NOT NULL,
  sections JSONB
);

CREATE TABLE IF NOT EXISTS event(
  id UUID PRIMARY KEY,
  patient_id VARCHAR(64) NOT NULL,
  type VARCHAR(32) NOT NULL,
  code VARCHAR(64),
  label VARCHAR(256),
  start_ts TIMESTAMP WITH TIME ZONE,
  end_ts TIMESTAMP WITH TIME ZONE,
  confidence DOUBLE PRECISION,
  source_note_id UUID REFERENCES note(id) ON DELETE CASCADE,
  evidence_span JSONB
);

CREATE INDEX IF NOT EXISTS idx_event_patient ON event(patient_id);

CREATE TABLE IF NOT EXISTS link(
  src_event_id UUID REFERENCES event(id) ON DELETE CASCADE,
  dst_event_id UUID REFERENCES event(id) ON DELETE CASCADE,
  relation VARCHAR(32),
  PRIMARY KEY (src_event_id, dst_event_id, relation)
);

CREATE TABLE IF NOT EXISTS guideline_result(
  id UUID PRIMARY KEY,
  patient_id VARCHAR(64) NOT NULL,
  rule_id VARCHAR(64) NOT NULL,
  status VARCHAR(16) NOT NULL,
  explanation TEXT,
  evidence_event_ids UUID[]
);
