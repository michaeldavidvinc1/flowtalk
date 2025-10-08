import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import {CheckCheck, Search, SquarePen} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {Avatar, AvatarImage} from "@/components/ui/avatar.tsx";
import {truncateText} from "@/helper/truncateText.tsx";

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
                    <div className="mt-4 text-black">
                        <div className="flex justify-between px-2 py-3 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
                            <div className="flex gap-3">
                                <Avatar className="size-10">
                                    <AvatarImage src="https://ui-avatars.com/api/?name=Michael+David&background=random" />
                                </Avatar>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-bold ">Username/Name</p>
                                    <div className="flex items-center gap-1">
                                        <CheckCheck className="size-4 text-blue-600" />
                                        <span className="text-xs">
                                            {truncateText("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate debitis fugiat, hic optio quae quibusdam quis reprehenderit sed sit velit!", 20)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span className="text-xs">6:32 AM</span>
                            </div>
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>Two</ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}

export default Dashboard;