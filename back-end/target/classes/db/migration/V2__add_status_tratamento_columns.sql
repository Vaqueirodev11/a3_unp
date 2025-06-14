-- Add status_tratamento column with default value
ALTER TABLE prontuarios ADD COLUMN status_tratamento VARCHAR(255) NOT NULL DEFAULT 'EM_TRATAMENTO';

-- Add data_alta column
ALTER TABLE prontuarios ADD COLUMN data_alta TIMESTAMP;

-- Add motivo_alta column
ALTER TABLE prontuarios ADD COLUMN motivo_alta VARCHAR(255);
