import { useState } from 'react'
import './App.css'

type ListProps = {
  animals: string[];
}

function List(props : ListProps)
{
  if (!props.animals)
  {
    return <div>Loading...</div>
  }

  if (props.animals.length === 0)
  {
    return <div>No elemnts in array</div>
  }
  
  return (
    <ul>
      {props.animals.map((animal) =>{
        return <li key={animal}>{animal}</li>;
      })}
    </ul>
  );
}

const App = () => {
  const [change, setChange] = useState(true);
  const animals = ["Lion", "Cat", "Dog", "Bird"];
  return (
    <>
      <button onClick={() => setChange(!change)}>Click here!</button>
      {change ? <h1>Hello 42 school</h1> :
      <h1>"Hello world"</h1>}
      <List animals={animals} />
    </>
  )
}

export default App
