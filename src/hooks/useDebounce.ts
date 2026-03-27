import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedvalue,setDebouncedValue] = useState<T>(value)
    useEffect(()=>{
        const handler=setTimeout(()=>{
            setDebouncedValue(value)
        },delay)
        return ()=>clearTimeout(handler)
    },[value,delay])
    return debouncedvalue;  
}