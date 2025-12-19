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
    const checkbox = screen.getByRole('checkbox');
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
    const checkboxes = screen.getAllByRole('checkbox');
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
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    // 件数表示
    expect(screen.getAllByText(/全て\(2\)/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/未完了\(1\)/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/完了\(1\)/)[0]).toBeInTheDocument();
  });
});
