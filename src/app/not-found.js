export default function NotFound(){
  return(
    <div className="flex flex-col w-full gap-3 h-full justify-center items-center">
        <h1 className="text-4xl">404 Not Found [ERROR]</h1>
        <p className="">Sorry your looking for the page is not found</p>
        <a href="/dashboard" className="">Go to Home</a>
    </div>
  )
}