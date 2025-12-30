import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"

export function PopUpSheet({childrenBtn,typeTitle,descrptive,children}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {childrenBtn}
      </SheetTrigger>
      <SheetContent side="bottom" className="w-full h-[80%]">
        <SheetHeader>
          <SheetTitle  className="text-white">{typeTitle}</SheetTitle>
          <SheetDescription className="text-gray-400">
           {descrptive}
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-5 p-3 overflow-y-scroll ">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}
