import "./globals.css";

export default function Index({ children }) {
  return (
    <html lang="en">
      <body
        data-cy="app"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <img id="background" src="background.svg" alt="" fetchPriority="high" />

        {children}
      </body>
    </html>
  );
}
