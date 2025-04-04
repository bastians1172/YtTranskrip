

const downloadTranscript = (result: string) => {
    if (!result) return;
  
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.txt";
    a.click();
  
    URL.revokeObjectURL(url);
};

export default downloadTranscript;
  