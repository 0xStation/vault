import { Button } from "@ui/Button";

export default function Home() {
  return (
    <>
      <p className="text-black">Hello world</p>
      <p className="text-gray">Hello world</p>
      <p className="text-white">Hello world</p>
      <p className="text-slate-600">Hello world</p>
      <p className="text-slate">Hello world</p>
      <p className="text-violet">Hello world</p>
      <p className="text-green">Hello world</p>
      <p className="text-blue">Hello world</p>
      <p className="text-orange">Hello world</p>
      <p className="text-red">Hello world</p>
      <p className="text-yellow">Hello world</p>
      <Button size="sm">Hello world</Button>
      <Button size="md">Hello world</Button>
      <Button size="md" loading>
        Hello world
      </Button>
      <Button disabled>Disabled</Button>
    </>
  );
}
