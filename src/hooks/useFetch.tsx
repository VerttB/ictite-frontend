import { useEffect, useState } from "react";

export function useFetch<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);



 useEffect(() => {

  if(!url) return;
  let isCancelled = false;
  const fetchedData = async () => {

    try{
    const res = await fetch(url);
    if(!res.ok) throw new Error("Erro ao buscar po dados");
    const jsonData = await res.json();
    if(!isCancelled) setData(jsonData);
    
    // eslint-disable-next-line
    }catch(err: any){
      setError(err.message || "erro desconhecido");
    }finally{
      setLoading(false);
    }
  }
  
  fetchedData();

  return () => {
    isCancelled = true;
  };

 },[url])

 return {data, loading ,error}
}
