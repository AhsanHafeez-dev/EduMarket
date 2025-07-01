"use client"

import { Input } from "../ui/input"
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Eye, EyeOff } from "lucide-react"; // Add this import for icons
import { useState } from "react";

function FormControls({ formControls = [], formData, setFormData }) {
  const [showPasswords, setShowPasswords] = useState({});

  const togglePasswordVisibility = (fieldName) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  function renderComponentByType(getControlItem) {
    let element = null;
    const currentControlItemValue = formData[getControlItem.name] || "";
    const hasError = getControlItem.error ? true : false;

    switch (getControlItem.componentType) {
      case "input":
        if (getControlItem.type === "number") {
          element = (
            <div>
              <Input
                id={getControlItem.name}
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                type="number"
                value={currentControlItemValue}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [getControlItem.name]: event.target.value,
                  })
                }
                min="0"
                step="0.01"
                className={hasError ? "border-red-500" : ""}
              />
              {hasError && (
                <p className="text-sm text-red-500 mt-1">{getControlItem.error}</p>
              )}
            </div>
          );
        } else if (getControlItem.type === "password") {
      
          const isPasswordVisible = showPasswords[getControlItem.name];
          element = (
            <div>
              <div className="relative">
                <Input
                  id={getControlItem.name}
                  name={getControlItem.name}
                  placeholder={getControlItem.placeholder}
                  type={isPasswordVisible ? "text" : "password"}
                  value={currentControlItemValue}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      [getControlItem.name]: event.target.value,
                    })
                  }
                  className={hasError ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(getControlItem.name)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 hover:text-gray-800"
                >
                  {isPasswordVisible ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {hasError && (
                <p className="text-sm text-red-500 mt-1">{getControlItem.error}</p>
              )}
            </div>
          );
        } else {
          element = (
            <div>
              <Input
                id={getControlItem.name}
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                type={getControlItem.type}
                value={currentControlItemValue}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [getControlItem.name]: event.target.value,
                  })
                }
                className={hasError ? "border-red-500" : ""}
              />
              {hasError && (
                <p className="text-sm text-red-500 mt-1">{getControlItem.error}</p>
              )}
            </div>
          );
        }
        break;
      case "select":
        element = (
          <div>
            <Select
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: value,
                })
              }
              value={currentControlItemValue}
            >
              <SelectTrigger className={hasError ? "border-red-500" : ""}>
                <SelectValue placeholder={getControlItem.label} />
              </SelectTrigger>
              <SelectContent>
                {getControlItem.options && getControlItem.options.length > 0
                  ? getControlItem.options.map((optionItem) => (
                      <SelectItem key={optionItem.id} value={optionItem.id}>
                        {optionItem.label}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
            {hasError && (
              <p className="text-sm text-red-500 mt-1">{getControlItem.error}</p>
            )}
          </div>
        );
        break;
      case "textarea":
        element = (
          <div>
            <Textarea
              id={getControlItem.name}
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              value={currentControlItemValue}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              className={hasError ? "border-red-500" : ""}
            />
            {hasError && (
              <p className="text-sm text-red-500 mt-1">{getControlItem.error}</p>
            )}
          </div>
        );
        break;

      default:
        element = (
          <div>
            <Input
              id={getControlItem.name}
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              type={getControlItem.type}
              value={currentControlItemValue}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              className={hasError ? "border-red-500" : ""}
            />
            {hasError && (
              <p className="text-sm text-red-500 mt-1">{getControlItem.error}</p>
            )}
          </div>
        );
        break;
    }

    return element;
  }

  return (
    <div className="flex flex-col gap-4">
      {formControls.map((controlItem) => (
        <div key={controlItem.name}>
          <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
          <div className="mt-1">{renderComponentByType(controlItem)}</div>
        </div>
      ))}
    </div>
  );
}

export default FormControls;