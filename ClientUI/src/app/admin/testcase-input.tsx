import type { ITestcase } from '../problems-list'
import { Textarea } from '@/components/ui/textarea'
import { Plus, X } from 'lucide-react'

interface TestcaseInputProps {
    testcases: ITestcase[],
    setTestcases: (testcases: ITestcase[]) => void
}

const TestcaseInput = ({
    testcases = [], setTestcases
}: TestcaseInputProps) => {

    const onChangeHandler = (ind: number, key: "input" | "output", value: string) => {
        const temp: ITestcase[] = [...testcases];
        temp[ind][key] = value;
        setTestcases(temp);
    }

    const addTestcaseHandler = (ind: number) => {
        console.log(ind)
        const temp = [...testcases];
        temp.splice(ind+1, 0, { id: "", input: "", output: "" });
        setTestcases(temp);
    }

    const removeTestcaseHandler = (ind: number) => {
        const temp = [...testcases];
        temp.splice(ind, 1);
        setTestcases(temp);
    }

    return (
        <div className='space-y-1'>
            {testcases.map((testcase, ind) => {
                return <div className="flex items-start gap-1" key={ind}>
                    <Textarea onChange={(e) => { onChangeHandler(ind, "input", e.target.value) }} placeholder='Enter input' value={testcase.input} />
                    <Textarea onChange={(e) => { onChangeHandler(ind, "output", e.target.value) }} placeholder='Enter output' value={testcase.output} />

                    <div className="flex gap-1">
                        <X className='border rounded-full p-1 hover:scale-110' size={25} onClick={() => removeTestcaseHandler(ind)} />
                        <Plus className='border rounded-full p-1 hover:scale-110' size={25} onClick={() => addTestcaseHandler(ind)} />
                    </div>
                </div>
            })}
        </div>
    )
}

export default TestcaseInput