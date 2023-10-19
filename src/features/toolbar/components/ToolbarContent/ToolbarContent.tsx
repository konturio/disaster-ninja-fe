import s from './ToolbarContent.module.css';

export const ToolbarContent = () => {
  return (
    <div className={s.toolbarContent}>
      <div className={s.tools}>
        <div className={s.buttons}>buttons</div>
        <div className={s.label}>label</div>
      </div>
      <div className={s.delimiter}></div>
      <div className={s.drawing}>
        <div className={s.buttons}>buttons</div>
        <div className={s.label}>label</div>
      </div>
    </div>
  );
};
