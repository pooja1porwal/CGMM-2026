import type { LogoConcept } from '../types/logo';
export default function LogoPreview({
  concept,
  className = '',
  svg,
}: {
  concept?: LogoConcept;
  className?: string;
  svg?: string;
}) {
  const content = svg || concept?.svg || '';
  return (
    <img
      className={'logo-preview ' + className}
      src={'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(content)}
      alt={concept ? `${concept.name} logo concept` : 'Brand logo variation'}
      draggable={false}
    />
  );
}
