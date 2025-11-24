export interface Root {
  name: string;
  contribution: string;
  era: string;
  impact: string;
  location: string;
}

export interface Trunk {
  key_figure: string;
  defining_work: string;
  year: string;
  context: string;
  influence: string;
}

export interface Branch {
  name: string;
  description: string;
  key_proponent: string;
  modern_example: string;
}

export interface Rival {
  name: string;
  why_it_opposes: string;
  key_figure: string;
  origin: string;
}

export interface GenealogyData {
  concept: string;
  summary: string;
  image_keywords: string;
  image_url?: string;
  roots: Root[];
  trunk: Trunk;
  branches: Branch[];
  rival: Rival;
}
