import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EventFilters } from "@/types/store";

const searchSchema = z.object({
  query: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  hasAvailableSeats: z.boolean().default(false),
});

type SearchForm = z.infer<typeof searchSchema>;

interface EventSearchProps {
  onSearch: (params: EventFilters) => void;
  filters: EventFilters;
}

interface FormFieldComponentProps {
  form: UseFormReturn<SearchForm>;
  name: keyof SearchForm;
  label: string;
  type: string;
  placeholder?: string;
}

export function EventSearch({ onSearch, filters }: EventSearchProps) {
  const form = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: filters,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSearch)}
        className="space-y-4 bg-card p-4 rounded-lg"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FormFieldComponent
            form={form}
            name="query"
            label="Search"
            type="text"
            placeholder="Search events..."
          />

          <FormFieldComponent
            form={form}
            name="startDate"
            label="Start Date"
            type="date"
          />

          <FormFieldComponent
            form={form}
            name="endDate"
            label="End Date"
            type="date"
          />

          <FormFieldComponent
            form={form}
            name="minPrice"
            label="Min Price"
            type="number"
          />

          <FormFieldComponent
            form={form}
            name="maxPrice"
            label="Max Price"
            type="number"
          />

          <FormField
            control={form.control}
            name="hasAvailableSeats"
            render={({ field }) => (
              <FormItem className="flex items-end mb-2 space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="bg-white data-[state=checked]:bg-primary"
                  />
                </FormControl>
                <FormLabel className="pb-1">Available Seats Only</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Search</Button>
      </form>
    </Form>
  );
}

function FormFieldComponent(props: FormFieldComponentProps) {
  const { form, name, label, type, placeholder } = props;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              value={field.value?.toString() ?? ""}
              className={`${type === "date" && "bg-gray-200"}`}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
