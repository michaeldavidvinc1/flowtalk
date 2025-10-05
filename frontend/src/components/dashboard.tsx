import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import {Search, SquarePen} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";

function Dashboard(){
    return (
        <div className="h-screen">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={10} className="min-w-[300px] max-w-[50%] px-3 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-black font-medium text-2xl">Chats</h1>
                        <div className="p-2 hover:bg-gray-200 rounded-md cursor-pointer transition-colors">
                            <SquarePen className="size-5 text-black" />
                        </div>
                    </div>
                    <div className="relative mt-2">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="pl-8 h-[30px]"
                        />
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>Two</ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default Dashboard;