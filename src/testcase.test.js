import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import TestApp from './testApp';
import ReactDOM from 'react-dom/client';

// window.alertをモック
beforeAll(() => {
  window.alert = jest.fn();
});

describe('App', () => {
  test('TestAppコンポーネントが描画される', () => {
    render(<App />);
    expect(screen.getByText('業務用Todo管理アプリ')).toBeInTheDocument();
  });
});

describe('index.js', () => {
  test('AppがStrictModeで描画される', () => {
    const rootDiv = document.createElement('div');
    rootDiv.id = 'root';
    document.body.appendChild(rootDiv);
    const root = ReactDOM.createRoot(rootDiv);
    expect(() => {
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    }).not.toThrow();
    document.body.removeChild(rootDiv);
  });
});

describe('TestApp', () => {
  test('初期表示でバージョン情報が表示される', () => {
    render(<TestApp />);
    expect(screen.getByText(/バージョン/)).toBeInTheDocument();
  });

  test('タスク追加バリデーション: 空欄は追加不可', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('新しいタスクを入力');
    const button = screen.getByText('追加');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);
    expect(screen.getByText('タスクがありません')).toBeInTheDocument();
  });

  test('タスクを追加し、リストに表示される', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('新しいタスクを入力');
    const button = screen.getByText('追加');
    fireEvent.change(input, { target: { value: 'テストタスク' } });
    fireEvent.click(button);
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
  });

  test('タスクを完了にでき、打消し線がつく', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('新しいタスクを入力');
    const button = screen.getByText('追加');
    fireEvent.change(input, { target: { value: '完了タスク' } });
    fireEvent.click(button);
    const checkbox = getTaskCheckboxes()[0];
    fireEvent.click(checkbox);
    const label = screen.getByText('完了タスク');
    expect(label.closest('li')).toHaveClass('completed');
  });

  test('タスクを削除できる', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('新しいタスクを入力');
    const button = screen.getByText('追加');
    fireEvent.change(input, { target: { value: '削除タスク' } });
    fireEvent.click(button);
    const deleteBtn = screen.getByText('削除');
    fireEvent.click(deleteBtn);
    expect(screen.getByText('タスクがありません')).toBeInTheDocument();
  });

  test('フィルタボタンで未完了・完了・全てを切り替えられる', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('新しいタスクを入力');
    const button = screen.getByText('追加');
    // 2つ追加
    fireEvent.change(input, { target: { value: 'A' } });
    fireEvent.click(button);
    fireEvent.change(input, { target: { value: 'B' } });
    fireEvent.click(button);
    // 1つ完了
    const checkboxes = getTaskCheckboxes();
    fireEvent.click(checkboxes[0]);
    // 完了のみ
    fireEvent.click(screen.getAllByText(/完了/)[1]);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    // 未完了のみ
    fireEvent.click(screen.getAllByText(/未完了/)[0]);
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.queryByText('A')).not.toBeInTheDocument();
    // 全て
    fireEvent.click(screen.getAllByText(/全て/)[0]);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  test('件数が正しく表示される', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('新しいタスクを入力');
    const button = screen.getByText('追加');
    fireEvent.change(input, { target: { value: 'A' } });
    fireEvent.click(button);
    fireEvent.change(input, { target: { value: 'B' } });
    fireEvent.click(button);
    // 1つ完了
    const checkboxes = getTaskCheckboxes();
    fireEvent.click(checkboxes[0]);
    // 件数表示
    expect(screen.getAllByText((content, el) => el.tagName === 'BUTTON' && /全て\(2\)/.test(content)).length).toBeGreaterThan(0);
    expect(screen.getAllByText((content, el) => el.tagName === 'BUTTON' && /未完了\(1\)/.test(content)).length).toBeGreaterThan(0);
    expect(screen.getAllByText((content, el) => el.tagName === 'BUTTON' && /完了\(1\)/.test(content)).length).toBeGreaterThan(0);
  });

  test('期日・優先度・重要フラグ付きでタスクを追加し、リストに正しく表示される', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('新しいタスクを入力');
    const dateInput = screen.getByPlaceholderText('期日');
    const prioritySelect = screen.getByDisplayValue('中');
    const importantCheck = screen.getByLabelText('重要');
    const button = screen.getByText('追加');
    // 入力
    fireEvent.change(input, { target: { value: '重要タスク' } });
    fireEvent.change(dateInput, { target: { value: '2025-12-31' } });
    fireEvent.change(prioritySelect, { target: { value: '高' } });
    fireEvent.click(importantCheck);
    fireEvent.click(button);
    // 表示確認
    expect(screen.getByText('重要タスク')).toBeInTheDocument();
    expect(screen.getByText('期日: 2025-12-31')).toBeInTheDocument();
    expect(screen.getByText('高優先')).toBeInTheDocument();
    expect(screen.getByTitle('重要')).toBeInTheDocument();
    // 重要解除ボタン
    expect(screen.getByText('重要解除')).toBeInTheDocument();
  });

  test('重要フラグの切り替えができる', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('新しいタスクを入力');
    const button = screen.getByText('追加');
    fireEvent.change(input, { target: { value: 'フラグテスト' } });
    fireEvent.click(button);
    // 重要!ボタンを押す
    const flagBtn = screen.getByText('重要!');
    fireEvent.click(flagBtn);
    expect(screen.getByTitle('重要')).toBeInTheDocument();
    // 重要解除ボタンを押す
    const unflagBtn = screen.getByText('重要解除');
    fireEvent.click(unflagBtn);
    expect(screen.queryByTitle('重要')).not.toBeInTheDocument();
  });

  test('期日・優先度・重要フラグなしでもタスク追加できる', () => {
    render(<TestApp />);
    const input = screen.getByPlaceholderText('新しいタスクを入力');
    const button = screen.getByText('追加');
    fireEvent.change(input, { target: { value: '普通タスク' } });
    fireEvent.click(button);
    expect(screen.getByText('普通タスク')).toBeInTheDocument();
    expect(screen.getByText('中優先')).toBeInTheDocument();
    // 期日・重要マークが表示されない
    expect(screen.queryByText(/期日:/)).not.toBeInTheDocument();
    expect(screen.queryByTitle('重要')).not.toBeInTheDocument();
  });

  // チェックボックスのうちタスク用のみ取得するユーティリティ
  function getTaskCheckboxes() {
    // 重要フラグ用はidがimportant-input
    return screen.getAllByRole('checkbox').filter(
      el => !el.id || !el.id.startsWith('important-input')
    );
  }
});
