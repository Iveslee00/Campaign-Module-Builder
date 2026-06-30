import type { ModuleType, PageModule } from '@/types/modules';

export interface ModuleDefinition<TData = unknown> {
  type: ModuleType;
  rootClass: string;
  cssFragment: string;
  renderHTML: (data: TData, module: PageModule, context: { modules: PageModule[] }) => string;
}
