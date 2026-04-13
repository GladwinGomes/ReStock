from apscheduler.schedulers.blocking import BlockingScheduler

stock = {
    "milk": 0,
    "curd": 0,
    "rajma": 0,
    "eggs": 0,
    "bread": 0,
    "bananas": 0,
    "carrots": 0,
    "chicken": 0
}

def restock(item):
    if item == "milk":
        stock[item] += 1000
    elif item == "curd":
        stock[item] += 1000
    elif item == "rajma":
        stock[item] += 1000
    elif item == "eggs":
        stock[item] += 12
    elif item == "bread":
        stock[item] += 2
    elif item == "bananas":
        stock[item] += 3
    elif item == "carrots":
        stock[item] += 1000
    elif item == "chicken":
        stock[item] += 1000

def diet():
    stock["milk"] -= 600
    stock["curd"] -= 200
    stock["rajma"] -= 75
    stock["carrots"] -= 100
    stock["chicken"] -= 180


def daily_update():
    diet()
    print("Daily update done")
    print(stock)


scheduler = BlockingScheduler()
scheduler.add_job(daily_update, "interval", seconds = 3)

scheduler.start()