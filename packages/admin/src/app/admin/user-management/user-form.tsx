
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { SelectUser } from '@/lib/db/schema';
import { addUser, updateUser } from './actions';
import { roleEnum } from '@/lib/db/schema';

type UserFormProps = {
  currentUser?: SelectUser | null;
  onSubmit: () => void;
};

const initialState = {
  message: '',
};

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : isEditing ? 'Update User' : 'Add User'}
    </Button>
  );
}

export function UserForm({ currentUser, onSubmit }: UserFormProps) {
  const [state, formAction] = useFormState(currentUser ? updateUser : addUser, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: state.message,
        });
      } else {
        toast({
          title: 'Success',
          description: state.message,
        });
        onSubmit();
      }
    }
  }, [state, toast, onSubmit]);

  return (
    <form action={formAction} className="space-y-4">
      {currentUser && <input type="hidden" name="id" value={currentUser.id} />}
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" name="fullName" defaultValue={currentUser?.fullName || ''} required />
        {state.errors?.fullName && <p className="text-sm text-destructive">{state.errors.fullName[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={currentUser?.email || ''} required />
         {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" placeholder={currentUser ? "Leave blank to keep current password" : ""}/>
         {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select name="role" defaultValue={currentUser?.role || ''}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {roleEnum.enumValues.map((role) => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
         {state.errors?.role && <p className="text-sm text-destructive">{state.errors.role[0]}</p>}
      </div>
      <div className="flex justify-end">
        <SubmitButton isEditing={!!currentUser} />
      </div>
    </form>
  );
}
