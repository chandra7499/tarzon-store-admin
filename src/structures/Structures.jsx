import clsx from "clsx"


export const Main = ({style,children}) => {
  return (
    <>
       <main className={clsx(style)}>{children}</main>
    </>
  )
}

