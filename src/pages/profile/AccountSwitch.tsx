import { useState } from "react";
import { Card } from "../../components/Card";
import * as bridge from "../../services/bridge";
import { useChildStore } from "../../store/useChildStore";
import { MAX_CHILDREN } from "../../types/models";
import "./AccountSwitch.css";

// 多账号切换（V3）：列出孩子、切换、添加、删除
export function AccountSwitch() {
  const { children, currentChildId, switchChild, addChild, deleteChild, loadChildren } = useChildStore();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState(1);

  const onSwitch = async (id: string) => {
    await switchChild(id);
  };
  const onAdd = async () => {
    if (!name.trim()) return;
    if (children.length >= MAX_CHILDREN) {
      alert(`最多添加 ${MAX_CHILDREN} 个孩子账号`);
      return;
    }
    await addChild({ name: name.trim(), avatar: "🧒", grade });
    setName("");
    setAdding(false);
  };
  const onDelete = async (id: string) => {
    if (!confirm("确定删除该孩子账号？相关进度/错题将一并清除。")) return;
    await deleteChild(id);
  };

  return (
    <div className="account">
      <div className="topbar">
        <span className="topbar__title">账号管理</span>
      </div>
      <p className="account__tip">当前使用账号为「{children.find((c) => c.id === currentChildId)?.name ?? "—"}」，可在此切换或管理其他孩子账号</p>

      <div className="account__list">
        {children.map((c) => (
          <Card key={c.id} className="account__card">
            <div className="account__avatar">{c.avatar}</div>
            <div className="account__info">
              <div className="account__name">
                {c.name} {c.id === currentChildId && <span className="account__current">当前</span>}
              </div>
              <div className="account__meta">{c.points}积分 · 正确率{c.accuracy}%</div>
            </div>
            {c.id === currentChildId ? (
              <span className="account__switched">使用中</span>
            ) : (
              <button className="btn account__switch" onClick={() => onSwitch(c.id)}>
                切换
              </button>
            )}
            <button className="account__del" onClick={() => onDelete(c.id)} title="删除">
              🗑
            </button>
          </Card>
        ))}
      </div>

      {adding ? (
        <Card className="account__form">
          <input className="account__input" placeholder="孩子昵称" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="account__grades">
            {[1, 2, 3, 4].map((g) => (
              <button
                key={g}
                className={"account__grade" + (grade === g ? " is-on" : "")}
                onClick={() => setGrade(g)}
              >
                {g}年级
              </button>
            ))}
          </div>
          <div className="account__form-actions">
            <button className="btn btn--ghost" onClick={() => setAdding(false)}>取消</button>
            <button className="btn" onClick={onAdd}>确认添加</button>
          </div>
        </Card>
      ) : (
        <button
          className="btn btn--block account__add"
          onClick={() => setAdding(true)}
          disabled={children.length >= MAX_CHILDREN}
        >
          + 添加新孩子账号
        </button>
      )}

      <p className="account__hint">
        温馨提示：每个孩子拥有独立的学习进度、积分、错题本和成长报告。最多可添加 {MAX_CHILDREN} 个孩子账号，左滑账号卡片可进行编辑或删除操作。
      </p>
    </div>
  );
}
