export function WebFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-6 px-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} BrillPrime. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
