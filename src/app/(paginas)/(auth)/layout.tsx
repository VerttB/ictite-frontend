export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex bg-background h-screen">
      <div className="flex flex-col justify-between p-24 bg-secondary text-font-secondary w-full h-full ">
        <h1 className="text-5xl font-bold">IAeditais</h1>
        <p className="text-2xl font-font-secondary">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo numquam dolorum voluptate quaerat quas sit animi eum delectus necessitatibus earum impedit laudantium facilis possimus, suscipit labore amet quasi libero blanditiis.
        </p>
      </div>
      <div className="h-full w-full">
        {children}
        </div>
    </div>
  );
}
