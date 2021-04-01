function hello(){
    console.log("hello")
}

class Node {
    constructor(data)
    {
        this.element = data;
        this.next = null
    }
}

class LinkedList {
    constructor()
    {
        this.head = null;
        this.size = 0;
    }

    add(element)
    {
        var node = new Node(element);
        var curr;

        if (this.head == null)
            this.head = node;
        else {
            curr = this.head;
            while (curr.next) {
                curr = curr.next;
            }
            curr.next = node;
        }
        this.size++;
    }

    removeFrom(index)
    {
        if (index > 0 && index > this.size)
        {
            console.log("out of index")
            return -1;
        }
        else {
            var curr, prev, it = 0;
            curr = this.head;
            prev = curr;

            if (index == 0)
            {
                this.head = curr.next;
            }
            else {
                while (it < index) {
                    it++;
                    prev = curr;
                    curr = curr.next;
                }
                prev.next = curr.next;
            }
            this.size--;
            return curr.element;
        }
    }

    indexOf(element)
    {
        var count = 0;
        var current = this.head;

        while (current != null) {
            if (current.element === element){
                console.log("true")
                return count;
            }
            count++;
            current = current.next;
        }

        return -1;
    }

    getList()
    {
        var curr = this.head;
        var str = "";
        while (curr) {
            str += curr.element + " ";
            curr = curr.next;
        }
        //console.log(str);
        return str
    }
}

var ll = new LinkedList();
ll.add(10);
ll.add(12);
ll.add(14);
ll.add(40);
ll.add(50);
//console.log("index of " + ll.indexOf(12))
ll.indexOf(12)
//ll.printList();
ll.removeFrom(3)
//ll.printList();

export { hello, Node, LinkedList};