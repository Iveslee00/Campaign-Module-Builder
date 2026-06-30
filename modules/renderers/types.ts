import type { ModuleType, PageModule } from '@/types/modules';

export type ModuleRenderMode = 'builder' | 'preview' | 'export';

export interface ModuleRenderContext {
  modules: PageModule[];
  mode: ModuleRenderMode;
}

export interface ModuleViewProps {
  module: PageModule;
  modules?: PageModule[];
  mode?: ModuleRenderMode;
}

export interface ModuleRendererDefinition {
  type: ModuleType;
  render: (module: PageModule, context: ModuleRenderContext) => string;
}
