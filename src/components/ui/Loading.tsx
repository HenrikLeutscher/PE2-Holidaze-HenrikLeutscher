export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center my-auto gap-5">
      <h3 className="text-header3">Page is loading...</h3>
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
