import type { ModuleType, PageModule } from '@/types/modules';

export type ModuleRuntimeMode = 'canvas' | 'preview' | 'export';
export type ModuleRenderMode = ModuleRuntimeMode;

export interface ModuleRenderContext {
  modules: PageModule[];
  runtimeMode: ModuleRuntimeMode;
}

export interface ModuleViewProps {
  module: PageModule;
  modules?: PageModule[];
  runtimeMode?: ModuleRuntimeMode;
}

export interface ModuleRendererDefinition {
  type: ModuleType;
  render: (module: PageModule, context: ModuleRenderContext) => string;
}
