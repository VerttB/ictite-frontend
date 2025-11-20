export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-background flex h-screen">
            <div className="bg-primary text-font-primary flex h-full w-full flex-col justify-between p-24">
                <h1 className="text-5xl font-bold">ICTITE</h1>
                <p className="font-font-secondary text-2xl">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo
                    numquam dolorum voluptate quaerat quas sit animi eum
                    delectus necessitatibus earum impedit laudantium facilis
                    possimus, suscipit labore amet quasi libero blanditiis.
                </p>
            </div>
            <div className="h-full w-full">{children}</div>
        </div>
    );
}
