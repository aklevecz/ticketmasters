type Props = {
  name: string;
  handleChange: (e: any) => void;
};

export default function Input({ name, handleChange }: Props) {
  return <input onChange={handleChange} name={name} placeholder={name}></input>;
}
