import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});




 test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', {name: /Add/i});
  const taskName = "Read a book";
  const dueDate = "07/01/2023";

  // First submission
  fireEvent.change(inputTask, { target: { value: taskName }});
  fireEvent.change(inputDate, { target: { value: dueDate }});
  fireEvent.click(addButton);

  // Try to add duplicate
  fireEvent.change(inputTask, { target: { value: taskName }});
  fireEvent.change(inputDate, { target: { value: dueDate }});
  fireEvent.click(addButton);

  const tasks = screen.getAllByText(new RegExp(taskName, "i"));
  expect(tasks.length).toBe(1);
 });
 

 test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', {name: /Add/i});
  const dueDate = "07/01/2023";

  fireEvent.change(inputDate, { target: { value: dueDate }});
  fireEvent.click(addButton);

  const date = screen.queryByText(new RegExp(dueDate, "i"));
  expect(date).not.toBeInTheDocument();
 });

 test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const addButton = screen.getByRole('button', {name: /Add/i});
  const taskName = "Study session";

  fireEvent.change(inputTask, { target: { value: taskName }});
  fireEvent.click(addButton);

  const task = screen.queryByText(new RegExp(taskName, "i"));
  expect(task).not.toBeInTheDocument();
 });



 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', {name: /Add/i});
  const taskName = "Temporary Task";
  const dueDate = "07/01/2023";

  fireEvent.change(inputTask, { target: { value: taskName }});
  fireEvent.change(inputDate, { target: { value: dueDate }});
  fireEvent.click(addButton);

  const deleteCheckbox = screen.getByRole('checkbox');
  fireEvent.click(deleteCheckbox);

  const task = screen.queryByText(new RegExp(taskName, "i"));
  expect(task).not.toBeInTheDocument();
 });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', {name: /Add/i});
  const pastDueDate = "01/01/2000";

  fireEvent.change(inputTask, { target: { value: "Past Due Task" }});
  fireEvent.change(inputDate, { target: { value: pastDueDate }});
  fireEvent.click(addButton);

  const overdueTask = screen.getByTestId("Past Due Task");
  expect(overdueTask.style.background).toBe("#ffcccc");
 });
