"use client";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";

import {
  calculatePasswordStrength,
  determineStrengthLevel,
  handleCopy,
  strengthLevels,
} from "@/lib/utils";
import { ArrowRight, Files } from "lucide-react";

interface Options {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export function LengthSlider() {
  const [password, setPassword] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [options, setOptions] = useState<Options>({
    length: 12,
    uppercase: false,
    lowercase: true,
    numbers: false,
    symbols: false,
  });
  const { toast } = useToast();

  const generatePassword = () => {
    setIsCopied(false);
    const alpha = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = alpha.toUpperCase();
    const numbers = "0123456789";
    const symbols = "!@#$%^&*_-+=";
    let characters = alpha;
    if (options.uppercase) characters += uppercase;
    if (options.numbers) characters += numbers;
    if (options.symbols) characters += symbols;

    let generatedPassword = "";
    for (let i = 0; i < options.length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      generatedPassword += characters[randomIndex];
    }

    setPassword(generatedPassword);
  };

  const handleCheckboxChange = (
    optionKey: keyof Omit<Options, "length">,
    checked: boolean | string
  ) => {
    const newOptions = { ...options, [optionKey]: checked };
    const checkedOptions = Object.keys(newOptions).filter(
      (k) => newOptions[k as keyof Options]
    );
    if (checked || checkedOptions.length > 1) {
      setOptions(newOptions);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Options",
        description: "At least one option must be selected.",
      });
    }
  };

  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const strengthScore = calculatePasswordStrength(options);
  const passwordStrength = determineStrengthLevel(strengthScore);

  return (
    <section className="flex flex-col gap-6 px-2 sm:px-0 w-full sm:w-[540px]">
      {/* Password */}
      <div className="flex flex-col text-center gap-4 sm:gap-8">
        <h2 className="headingM text-darkSlate-foreground">
          Password Generator
        </h2>

        <div className="bg-darkSlate flex py-4 px-4 sm:px-8 justify-between items-center">
          <Input
            value={password}
            type="text"
            disabled
            readOnly
            className="font-bold text-3xl text-white dark:text-whiteish bg-transparent px-0 truncate border-none"
          />

          <Button
            variant="ghost"
            className={`bg-transparent p-0 m-0 ${
              isCopied ? "text-strongGreen" : "dark:text-whiteish text-white"
            }`}
            onClick={() => {
              handleCopy(password);
              setIsCopied(true);
              toast({
                title: "Copied!",
                description: "Password copied to clipboard.",
              });
            }}
          >
            <Files className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Options Box */}
      <div className="bg-darkSlate p-4 sm:p-8 flex flex-col gap-8">
        {/* Slider */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="body text-white dark:text-whiteish">
              Character Length
            </p>
            <h6 className="headingL text-strongGreen">{options.length}</h6>
          </div>
          <Slider
            defaultValue={[options.length]}
            max={100}
            min={8}
            step={1}
            onValueChange={(value) => {
              setOptions({ ...options, length: value[0] });
            }}
          />
        </div>
        {/* Checkboxes */}
        <div className="flex flex-col gap-5">
          {Object.keys(options).map((key) => {
            if (key === "length") return null;
            const optionKey = key as keyof Omit<Options, "length">;

            return (
              <div
                className="flex items-center gap-6"
                key={key}
              >
                <Checkbox
                  id={key}
                  checked={options[optionKey]}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(optionKey, checked)
                  }
                  className="border-white dark:border-whiteish"
                />
                <label
                  htmlFor={key}
                  className="body text-white dark:text-whiteish cursor-pointer"
                >
                  Include {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
              </div>
            );
          })}
        </div>
        {/* Strength */}
        <div className="bg-blackish flex justify-between sm:px-8 sm:py-6 p-4 items-center">
          <p className="body text-darkSlate-foreground">STRENGTH</p>

          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <p className="headingM text-white dark:text-whiteish  uppercase">
              {passwordStrength.label}
            </p>
            <div className="flex gap-1 sm:gap-2">
              {strengthLevels.map((level, index) => (
                <div
                  key={level.label}
                  className={`h-7 w-[10px] border-2 ${
                    strengthScore >= (index + 1) * 8
                      ? level.color === "r"
                        ? "border-strongRed bg-strongRed"
                        : level.color === "o"
                        ? "border-strongOrange bg-strongOrange"
                        : level.color === "y"
                        ? "border-strongYellow bg-strongYellow"
                        : "border-strongGreen bg-strongGreen"
                      : "dark:border-whiteish border-white"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Button */}
        <Button
          className="flex items-center gap-4 bg-strongGreen uppercase text-darkSlate rounded-none font-bold text-lg h-16
          hover:border hover:border-strongGreen hover:bg-transparent hover:text-strongGreen"
          onClick={generatePassword}
        >
          Generate <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
