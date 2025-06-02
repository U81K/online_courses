import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  return (
    <>
      <Input label="First input" cn={text} handler={(input)=>{setText(input)}}/>
      <Input label="Second input" cn={text} handler={(input)=>{setText(input)}}/>
    </>
  );
}

function Input({ label , cn, h}) {
  // const [text, setText] = useState('');

  function handleChange(e) {
    // setText(e.target.value);
    h(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={cn}
        onChange={handleChange}
      />
    </label>
  );
}
