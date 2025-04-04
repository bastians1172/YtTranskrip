"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface LanguageSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export default function LanguageSelect({ value, onValueChange }: LanguageSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="">
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es">Spanish</SelectItem>
        <SelectItem value="fr">French</SelectItem>
        <SelectItem value="de">German</SelectItem>
        <SelectItem value="zh-CN">Chinese (Simplified)</SelectItem>
        <SelectItem value="ja">Japanese</SelectItem>
        <SelectItem value="ko">Korean</SelectItem>
        <SelectItem value="hi">Hindi</SelectItem>
        <SelectItem value="ar">Arabic</SelectItem>
        <SelectItem value="pt">Portuguese</SelectItem>
        <SelectItem value="ru">Russian</SelectItem>
        <SelectItem value="id">Indonesian</SelectItem>
        <SelectItem value="ms">Malay</SelectItem>
        <SelectItem value="th">Thai</SelectItem>
        <SelectItem value="vi">Vietnamese</SelectItem>
      </SelectContent>
    </Select>
  );
}
